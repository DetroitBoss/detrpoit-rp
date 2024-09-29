import { CustomEvent } from "./custom.event";
import { DonateEntity } from "./typeorm/entities/donate";
import { COINS_FOR_ONE_ROUBLE, DONATE_STATUS } from "../../shared/economy";
import { User } from "./user";
import { app } from "./web";
import { system } from "./system";
import { gui } from "./gui";
import { saveEntity } from "./typeorm";
import cors from 'cors'
import fetch from 'node-fetch'
import crypto from 'crypto'

CustomEvent.registerCef('isDonateEnabled', player => {
    return !!User.x2func.data[0].enabledonate
})

app.post('/donate/create', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')

    res.statusCode = 200
    const body = req.body

    console.log(body)
    const coinsAmount = body.coins

    if (isNaN(coinsAmount) || coinsAmount < 200) {
        res.statusCode = 500
        return res.send()
    }

    const paymentAmount = coinsAmount / COINS_FOR_ONE_ROUBLE

    if (!User.x2func.data[0].enabledonate) {
        res.statusCode = 500
        return res.send()
    }

    const paymentId = system.timestampMS
    // @ts-ignore
    const response = await fetch('https://enot.io/pay?' + new URLSearchParams({
        m: 37025,
        oa: paymentAmount,
        o: paymentId,
        s: crypto
            .createHash('md5')
            .update(`37025:${paymentAmount}:3uXfaTxvlCq9nhpS_KloxDuuEgT4n4mf:${paymentId}`)
            .digest('hex'),
        cr: "RUB"
    }).toString(), {
        method: 'get',
    })
    const paymentLink = response.url

    console.log(paymentLink)

    const accountId = (await User.getData(body.id))?.accountId
    if (!accountId) {
        res.statusCode = 500
        return res.send()
    }

    let pay = new DonateEntity()
    pay.account = accountId
    pay.sum = paymentAmount
    pay.status = DONATE_STATUS.CREATED
    pay.paynumber = paymentId.toString()


    await saveEntity(pay)

    res.send(JSON.stringify({
        url: paymentLink
    }))
})

app.post('/donate/approve', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept')

    console.log(req.body)

    res.statusCode = 200

    const { amount, merchant_id, sign_2 } = req.body as {
        amount: string, merchant_id: string, sign_2: string
    }

    const sign2 = crypto
        .createHash('md5')
        .update(`37025:${amount}:dnv9zFXjHR3MdUBKejQoZNp4g09vUvQC:${merchant_id}`)
        .digest('hex')

    if (sign2 != sign_2) {
        console.error('Bad sign')
        return res.send()
    }

    const payment = await DonateEntity.findOne({
        where: {
            paynumber: merchant_id,
        }
    })
    if (!payment) {
        console.error('Attempt to approve non-existed payment')
        return res.send()
    }

    payment.status = DONATE_STATUS.PAYED
    await payment.save()

    return res.send()
})

const payVerify = (item: DonateEntity) => {
    if ([DONATE_STATUS.CREATED, DONATE_STATUS.DONE].includes(item.status)) return false;
    const target = User.getByAccountId(item.account)
    if(!target || !target.user) return false;
    const account = target.user.account;
    if(!account) return false;
    const sum = item.sum * COINS_FOR_ONE_ROUBLE;
    system.debug.info(`Успешный донат на аккаунт ${account.login} [${account.id}] на сумму ${sum}`)
    item.status = DONATE_STATUS.DONE;
    account.donate = account.donate + sum;
    account.save();
    item.save();
    return true;
}

const donatePayVerify = () => DonateEntity.find({status: DONATE_STATUS.PAYED}).then((list => list.map(item => payVerify(item))))

setInterval(() => donatePayVerify(), 60000)