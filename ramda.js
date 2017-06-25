// Example 1 - Dealing With Null Checks
//
const R = require("ramda");
const prop = R.prop;
const path = R.path;
const curry = R.curry;
const Maybe = require("ramda-fantasy").Maybe;

let joeUser = {
    name: 'joe',
    email: 'joe@example.com',
    prefs: {
        languages: {
            primary: 'sp',
            secondary: 'en'
        }
    }
};
let indexURLs = {
    'en': 'http://mysite.com/en',  //English
     'sp': 'http://mysite.com/sp', //Spanish
    'jp': 'http://mysite.com/jp'   //Japanese
}

const getURLForUser = user => {
  return Maybe(user) //wrap user in a Maybe object
    .map(path(["prefs", "languages", "primary"])) //use Ramda's to grab primary language
    .chain(maybeGetUrl); //pass language to maybeGetUrl &  get url or null Monad
};

const maybeGetUrl = R.curry(function(allUrls, language) {
  //curry to convert this to a single arg func
  return Maybe(allUrls[language]); //return Monad(url | null)
})(indexURLs); //pass indexURLs instead of accessing globally

function boot(user, defaultURL) {
  console.log(getURLForUser(user).getOrElse(defaultURL));
}

// boot(joeUser, "http://site.com/en");




// Example 2 - Either Monad
var Either = require('ramda-fantasy').Either;
var Left = Either.Left;
var Right = Either.Right;

const tax = R.curry((tax, price) => {
  if (typeof(price) !== 'number') return Left(new Error("Price must be numeric"));

  return  Right(price + (tax * price));
});

const discount = R.curry((dis, price) => {
  if (typeof(price) !== 'number') return Left(new Error("Price must be numeric"));

  if (price < 10) return Left(new Error("discount cant be applied for items priced below 10"));

  return Right(price - (price * dis));
});

const addCaliTax = (tax(0.1));//10%
const apply25PercDisc = (discount(0.25));// 25% discount
const getItemPrice = (item) => Right(item.price);
const displayTotal = (total) => { console.log('Total Price: ' + total) };
const logError = (error) => { console.log('Error: ' + error.message); };

const eitherLogOrShow = Either.either(logError, displayTotal);


const showTotalPrice = item => eitherLogOrShow(getItemPrice(item).chain(apply25PercDisc).chain(addCaliTax))

let tShirt = { name: 't-shirt', price: 11 };
let pant = { name: 't-shirt', price: '10 dollars' };
let chips = { name: 't-shirt', price: 5 }; //less than 10 dollars error

showTotalPrice(tShirt)
showTotalPrice(pant)
showTotalPrice(chips)
