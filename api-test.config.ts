
const processENV = process.env.TEST_ENV
const env  = processENV || 'QA' 


console.log(`The environment is equal to ${env}`)

const config  ={
   apiUrl:'https://conduit-api.bondaracademy.com/api/',
   userEmail:"shreyasbm09@gmail.com",
   userPassword:"Shreyas@09"
}

if(env =='dev'){
 //   config.apiUrl ="QA ENVIRONment url"
    config.userEmail="pwtest@test.com",
   config.userPassword="Welcome2"
}

// if(env =='stage'){
//    config.apiUrl ="Stage or prerprod ENVIRONment url"

//     config.userEmail="STAGEshreyasbm09@gmail.com",
//    config.userPassword="STAGEShreyas@09"
// } 
//$env:TEST_ENV = "stage"; npx playwright test tests/smoketest.spec.ts



export {config}
