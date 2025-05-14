import {formatCurrency} from '../scripts/utils/money.js';
console.log('convert cents to dollars')
if ( formatCurrency(2095) ==='20.95')
{
  console.group('Passed');
}
else{
  console.log('Failed');
}

console.log('Works with zero')
if ( formatCurrency(0) ==='0.00')
{
  console.group('Passed');
}
else{
  console.log('Failed');
}

console.log('Rounds up to the nearest cent')
if ( formatCurrency(2000.5) ==='20.01')
{
  console.group('Passed');
}
else{
  console.log('Failed');
}
