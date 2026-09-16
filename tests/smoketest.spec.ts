import { test } from '../utils/fixtures'
import { expect } from '../utils/cutom-expect1'
import { APILogger } from '../utils/logger';
import {createToken} from '../helpers/createToken'


// let authToken: string;
// test.beforeAll("Runs before allthe test", async ({ api,config }) => {
//     // const tokenResponse = await api.path('/users/login')
//     //     .body({ "user": { "email": config.userEmail, "password": config.userPassword } })
//     //     .postRequest(200)
//     authToken = await createToken("pwtest@test.com","Welcome2")
//    // console.log(tokenResponse.user)
// })

test("logger",async ({})=>{
    const logger = new APILogger();
    logger.logRequest('POST','https://test.com/api',{Authorization:"Auth"},{foo:'bar'});
    logger.logResponse(200,{foo:'bar'})

    const logs = logger.getRecentLogs()
    console.log(logs)

})


test("get Articles ", async ({ api }) => {
    const response = await api
        .path('/articles/')
      //  .headers({Authorization:authToken})
        .params({ limit: 10, offset: 0 })
        .clearAuth()
        .getRequest(200)
    console.log(response)
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10)

    const response1 = await api.path("/tags/")
        .getRequest(200);
    expect(response1.tags[0]).shouldEqual('Test')
    expect(response1.tags.length).shouldBeLessThanOrEqual(10)


})

test("Get Test Tags", async ({ api }) => {
    const response = await api.path("/tags/")
        .getRequest(200);
    expect(response.tags[0]).shouldEqual('Test')
    expect(response.tags.length).shouldBeLessThanOrEqual(10)
})

test("Create and delete articles", async ({ api }) => {
    const createArticleResponse = await api.path('/articles/')
        .body({ "article": { "title": "Test 1", "description": "Test Article 2", "body": "Test Body 2" } })
        .postRequest(201)

    const slugID = await createArticleResponse.article.slug;
    expect(createArticleResponse.article.title).shouldEqual("Test 1");

    const getArticlesResponse = await api.path('/articles/')
        .getRequest(200)
    expect(getArticlesResponse.articles[0].title).shouldEqual('Test 1')

    const deleteArticelResponse = await api.path(`/articles/${slugID}`)
        .deleteRequest(204)

    const getArticlesResponse2 = await api.path('/articles/')
        .getRequest(200)
    expect(getArticlesResponse2.articles[0].title).not.shouldEqual('Test 1')

})


test("Create, Update and delete articles", async ({ api }) => {
    const createArticleResponse = await api.path('/articles/')
        .body({ "article": { "title": "Test 2", "description": "Test Article 2", "body": "Test Body 2" } })
        .postRequest(201)

            const slugID = await createArticleResponse.article.slug;
    expect(createArticleResponse.article.title).shouldEqual("Test 2");

    const getArticlesResponse = await api.path('/articles/')
        .getRequest(200)
    expect(getArticlesResponse.articles[0].title).shouldEqual('Test 2')

    const updateArticleResponse = await api.path(`/articles/${slugID}`)
        .body({ "article": { "title": "Test 2 Re modified", "description": "Modified Test 2 Re modified", "body": "modified Body", "tagList": [], "slug": `${slugID}` } })
        .putRequest(200)
    const getUpdatedArticlesResponse = await api.path('/articles/')
        .getRequest(200)
    expect(getUpdatedArticlesResponse.articles[0].title).shouldEqual('Test 2 Re modified')

        const modifiedSLugID = getUpdatedArticlesResponse.articles[0].slug;

    const deleteArticelResponse = await api.path(`/articles/${modifiedSLugID}`)
        .deleteRequest(204)

    const getArticlesResponse2 = await api.path('/articles/')
        .getRequest(200)
    expect(getArticlesResponse2.articles[0].title).not.shouldEqual('Test 2 Re modified')

})