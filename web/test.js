const recurring = { sunday: true, monday: false };
const objMap = { 1: 'sunday', 2: 'monday' };
const week = 2;

if (recurring[objMap[week]]) {
  console.log('test pass');
}
