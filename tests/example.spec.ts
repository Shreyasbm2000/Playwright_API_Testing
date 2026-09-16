import { test, expect, request } from '@playwright/test';


let authToken:string;
test.beforeAll("Runs before allthe test",async ({request})=>{
  console.log("Before running the test")
   const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login',
                                        {data:{"user":{"email":"shreyasbm09@gmail.com","password":"Shreyas@09"}}} )

  const tokenResponseJson = await tokenResponse.json();
   authToken =  "Token "+ tokenResponseJson.user.token;
}
)


test('Get Test Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const tagsResponseJson = await tagsResponse.json()

   expect(tagsResponse.status()).toBe(200)
   expect(tagsResponseJson.tags[0]).toEqual('Test')
   expect(tagsResponseJson.tags.length).toBeLessThanOrEqual(10)
  console.log(tagsResponseJson)
 
});


test("Get all articles", async ({request})=>{
  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articlesResponseJson = await articlesResponse.json();

  expect(articlesResponse.status()).toBe(200);
  expect(articlesResponseJson.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJson.articlesCount).toBe(10);
  console.log(articlesResponseJson)
})


test("Create and Delete a article",async ({request})=>{
 
  

const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',
  {data:{
    "article": {
        "title": "Test 1",
        "description": "Test Article 2",
        "body": "Test Body 2",
        "tagList": [
            "test2"
        ]
    }
},
headers: {
  Authorization: authToken,
}}
)

const newArticleResponseJson = await newArticleResponse.json();
const slugID = await newArticleResponseJson.article.slug;
expect(newArticleResponse.status()).toEqual(201);
expect(newArticleResponseJson.article.title).toEqual("Test 1");
 

const getArticlesResposne = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{headers:{Authorization:authToken}})
const getArticlesResposneJson = await getArticlesResposne.json();
expect(getArticlesResposne.status()).toEqual(200)
expect(getArticlesResposneJson.articles[0].title).toEqual('Test 1')

const deleteArticelResposne = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`,{headers:{Authorization:authToken}})
 expect(deleteArticelResposne.status()).toEqual(204)
})


test("Create, Update and Delete a article",async ({request})=>{
 
const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/',
  {data:{
    "article": {
        "title": "Test 2",
        "description": "Test Article 2",
        "body": "Test Body 2",
        "tagList": [
            "test2"
        ]
    }
},
headers: {
  Authorization: authToken,
}}
)

const newArticleResponseJson = await newArticleResponse.json();
expect(newArticleResponse.status()).toEqual(201);
expect(newArticleResponseJson.article.title).toEqual("Test 2");
 

const getArticlesResposne = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{headers:{Authorization:authToken}})
const getArticlesResposneJson = await getArticlesResposne.json();
expect(getArticlesResposne.status()).toEqual(200)
expect(getArticlesResposneJson.articles[0].title).toEqual('Test 2')
const slugID:string =  getArticlesResposneJson.articles[0].slug;


const updateArticleResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`,
  {data:{
    "article": {
        "title": "Test 2 Re modified",
        "description": "Modified Test 2 Re modified",
        "body": "modified Body",
        "tagList": [],
        "slug": `${slugID}`
    }
},headers:{Authorization:authToken}})

const updateArticleResponseJson = await updateArticleResponse.json();

 expect(updateArticleResponseJson.article.title).toEqual("Test 2 Re modified");
 expect(updateArticleResponse.status()).toEqual(200)

 const updatedSlugID = updateArticleResponseJson.article.slug;
 
 const getUpdatedArtileResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',{headers:{Authorization:authToken}})

const getUpdatedArtileResponseJson = await getUpdatedArtileResponse.json();
expect(getUpdatedArtileResponse.status()).toEqual(200)
expect(getUpdatedArtileResponseJson.articles[0].title).toEqual('Test 2 Re modified')


const deleteArticelResposne = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedSlugID}`,{headers:{Authorization:authToken}})
 expect(deleteArticelResposne.status()).toEqual(204)




})