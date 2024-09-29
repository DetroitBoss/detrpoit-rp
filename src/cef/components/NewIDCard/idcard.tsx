// @ts-nocheck
import React from 'react';

export const IdCard = () => {
    const [maneBtn, setManeBtn] = useState( [{name:"test"},{name:"test"}] );
    let clilckKey = () => {
        console.log( "key");
        setManeBtn((maneBtn) => {
            maneBtn[0] = {name:'test'};
            return ( [...maneBtn ] );
        } );
    }
    return <>
        <h1>onyx ID Card</h1>    
        <div onClick={clilckKey}> Нажать</div>
    </>
}