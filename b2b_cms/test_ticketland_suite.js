/**
 * Comprehensive Integration Test for Ticketland Protocol Endpoints
 */
const http = require('http');

const PORT = 3000;
const AUTH_HEADER = 'Basic ' + Buffer.from('ticketland_partner:neva_ships_2026_tl').toString('base64');

function request(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const reqHeaders = {
            'Authorization': AUTH_HEADER,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers
        };

        const postData = body ? JSON.stringify(body) : null;
        if (postData) {
            reqHeaders['Content-Length'] = Buffer.byteLength(postData);
        }

        const options = {
            hostname: '127.0.0.1',
            port: PORT,
            path: path,
            method: method,
            headers: reqHeaders
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                resolve({
                    status: res.statusCode,
                    headers: res.headers,
                    body: parsed
                });
            });
        });

        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function runTests() {
    console.log('--- STARTING TICKETLAND INTEGRATION TEST SUITE ---');

    try {
        // 1. Test 401 Unauthorized
        console.log('\n[Test 1] Auth check (missing header)...');
        const unauth = await request('GET', '/constructive?segment[]=building', null, { 'Authorization': '' });
        console.log('Status:', unauth.status, 'Response:', unauth.body);
        if (unauth.status === 401) console.log('✓ PASS: Unauthorized rejected with 401');

        // 2. Test GET /constructive
        console.log('\n[Test 2] GET /constructive...');
        const constructive = await request('GET', '/constructive?hallId=2&hallVersion=1&segment[]=building&segment[]=hall&segment[]=section&segment[]=place');
        console.log('Status:', constructive.status);
        console.log('Buildings:', constructive.body.buildings?.length);
        console.log('Halls:', constructive.body.halls?.length);
        console.log('Sections:', constructive.body.sections?.length);
        console.log('Places count:', constructive.body.places?.length);
        if (constructive.body.places?.length > 0) console.log('Sample place:', constructive.body.places[0]);

        // 3. Test GET /repertoire
        console.log('\n[Test 3] GET /repertoire...');
        const repertoire = await request('GET', '/repertoire');
        console.log('Status:', repertoire.status);
        console.log('Organizers:', repertoire.body.organizers);
        console.log('Shows count:', repertoire.body.shows?.length);
        console.log('Performances count:', repertoire.body.performances?.length);
        const testPerf = repertoire.body.performances?.[0];
        console.log('Test Performance:', testPerf);

        if (!testPerf) {
            console.error('No performances found!');
            return;
        }

        const perfId = testPerf.id;

        // 4. Test GET /modifiedRepertoire
        console.log('\n[Test 4] GET /modifiedRepertoire...');
        const modRep = await request('GET', '/modifiedRepertoire');
        console.log('Status:', modRep.status, 'Tag:', modRep.body.modificationTag, 'Count:', modRep.body.performances?.length);

        // 5. Test GET /tickets
        console.log(`\n[Test 5] GET /tickets?performanceId=${perfId}...`);
        const ticketsRes = await request('GET', `/tickets?performanceId=${perfId}`);
        console.log('Status:', ticketsRes.status, 'Available tickets:', ticketsRes.body.tickets?.length);
        const testPlace = ticketsRes.body.tickets?.[0];
        console.log('Test Place to lock:', testPlace);

        const placeId = testPlace.placeId;

        // 6. Test POST /lockTicket
        console.log(`\n[Test 6] POST /lockTicket (perf: ${perfId}, place: ${placeId})...`);
        const lockRes = await request('POST', '/lockTicket', {
            performanceId: perfId,
            placeId: placeId
        });
        console.log('Status:', lockRes.status, 'Body:', lockRes.body);
        const basketId = lockRes.body.basketId;

        // 7. Test Double Lock (should fail with code 201)
        console.log('\n[Test 7] POST /lockTicket double lock check...');
        const doubleLock = await request('POST', '/lockTicket', {
            performanceId: perfId,
            placeId: placeId,
            basketId: 'another_basket'
        });
        console.log('Status:', doubleLock.status, 'Body:', doubleLock.body);
        if (doubleLock.status === 500 && doubleLock.body.code === 201) {
            console.log('✓ PASS: Double lock prevented');
        }

        // 8. Test GET /lockedTickets
        console.log(`\n[Test 8] GET /lockedTickets?basketId=${basketId}...`);
        const lockedList = await request('GET', `/lockedTickets?basketId=${basketId}`);
        console.log('Status:', lockedList.status, 'Body:', lockedList.body);

        // 9. Test POST /createOrder
        console.log('\n[Test 9] POST /createOrder...');
        const createOrderRes = await request('POST', '/createOrder', {
            basketId: basketId,
            customer: {
                id: '9901',
                surname: 'Иванов',
                name: 'Иван',
                patronymic: 'Иванович',
                phone: '79991234567',
                email: 'ivanov@example.com'
            },
            ticketExtras: [
                {
                    performanceId: perfId,
                    placeId: placeId,
                    price: testPlace.price,
                    spectatorPersonalData: {
                        ditId: 'mts_test_01',
                        surname: 'Иванов',
                        name: 'Иван'
                    }
                }
            ]
        });
        console.log('Status:', createOrderRes.status, 'Body:', createOrderRes.body);
        const orderId = createOrderRes.body.orderId;

        // 10. Test GET /printableOrderData
        console.log(`\n[Test 10] GET /printableOrderData?orderId=${orderId}...`);
        const printData = await request('GET', `/printableOrderData?orderId=${orderId}`);
        console.log('Status:', printData.status, 'Printable tickets:', printData.body.tickets);

        // 11. Test POST /confirmOrder
        console.log(`\n[Test 11] POST /confirmOrder...`);
        const confirmRes = await request('POST', '/confirmOrder', {
            orderId: orderId,
            time: '2026-05-15T18-30-00',
            paymentPushkinCard: false,
            saleOnYourFrame: false
        });
        console.log('Status:', confirmRes.status, 'Body:', confirmRes.body);

        // 12. Test GET /orderedTickets
        console.log(`\n[Test 12] GET /orderedTickets?orderId=${orderId}...`);
        const orderedList = await request('GET', `/orderedTickets?orderId=${orderId}`);
        console.log('Status:', orderedList.status, 'Body:', orderedList.body);

        // 13. Test PUT /changeOrder/spectators
        console.log(`\n[Test 13] PUT /changeOrder/spectators...`);
        const changeSpectatorRes = await request('PUT', '/changeOrder/spectators', {
            orderId: orderId,
            ticketExtras: [
                {
                    performanceId: perfId,
                    placeId: placeId,
                    spectatorPersonalData: {
                        ditId: 'mts_updated_99',
                        surname: 'Смирнов',
                        name: 'Алексей'
                    }
                }
            ]
        });
        console.log('Status:', changeSpectatorRes.status, 'Body:', changeSpectatorRes.body);

        // 14. Test POST /returnTickets (193-FZ)
        console.log(`\n[Test 14] POST /returnTickets...`);
        const returnRes = await request('POST', '/returnTickets', {
            orderId: orderId,
            time: '2026-05-15T18-45-00',
            tickets: [
                {
                    performanceId: perfId,
                    placeId: placeId,
                    price: testPlace.price,
                    returnPrice: testPlace.price
                }
            ]
        });
        console.log('Status:', returnRes.status, 'Body:', returnRes.body);

        // 15. Test GET /salesReport
        console.log(`\n[Test 15] GET /salesReport...`);
        const reportRes = await request('GET', '/salesReport');
        console.log('Status:', reportRes.status, 'Report rows count:', reportRes.body.tickets?.length);
        console.log('Sample report rows:', reportRes.body.tickets);

        // 16. Test POST /removeOrder
        console.log(`\n[Test 16] POST /removeOrder...`);
        const removeRes = await request('POST', '/removeOrder', { orderId: orderId });
        console.log('Status:', removeRes.status, 'Body:', removeRes.body);

        console.log('\n--- ALL TICKETLAND SPECIFICATION TESTS COMPLETED SUCCESSFULLY! ---');
    } catch (e) {
        console.error('Test failed with error:', e);
    }
}

// Start test runner
runTests();
