const { seedDemoData, ensureUser, products, addDemoBalance, buyProduct, stats } = require('./db');

seedDemoData();
const fakeUser = { id: 123456789, first_name: 'Demo', username: 'demo_user' };
const user = ensureUser(fakeUser);
console.log('user', user.telegram_id);

const list = products();
console.log('products', list.map(p => `${p.slug}:${p.stock}`).join(', '));
if (list.length < 3) throw new Error('Expected demo products');

const topped = addDemoBalance(fakeUser.id, 300000);
console.log('balanceAfterTopup', topped.balance);
if (topped.balance < 300000) throw new Error('Topup failed');

const result = buyProduct(fakeUser.id, 'prompt-pack');
console.log('buy', result);
if (!result.ok || !result.payload) throw new Error('Buy failed');

const s = stats();
console.log('stats', s);
console.log('SMOKE_OK');
