
require('cross-fetch/polyfill');
//const PocketBase = require('pocketbase/cjs')


(async( ) => {
    const res=  await fetch('https://pure-track.pockethost.io/api/admins/auth-with-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            identity: 'schleife01_webinar@icloud.com',
            password: 'E!HigNLRU_.v2kDCYjxDC3VDAFwoe39w@re'
        })
    }).then(r => r.json())
    console.log(res);
    //await pb.admins.authWithPassword('schleife01_webinar@icloud.com','E!HigNLRU_.v2kDCYjxDC3VDAFwoe39w@re')
    const data = {
        "plan": "test",
        "day": "test",
        "exercise": "test",
        "set": 123,
        "target_rep": 123
    };
    
    //const record = await pb.collection('Templates').create(data);
})()
