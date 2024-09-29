import LicensesStore from "./index";
import {ILicenceGetDataStore} from '../../../shared/licence';

export default {
    'license:show': (store: LicensesStore, data: ILicenceGetDataStore) => {
        const items: ILicenceGetDataStore[] = [...store.items]
        items.push(data);
        store.setState({items});
    }
}