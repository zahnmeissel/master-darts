import { addTodoMockData, listTodoMockData } from "./mockData.js";
import { getApiUrl } from "../utils.js";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(getApiUrl("posts"), () => {
    console.log("get posts");
    return HttpResponse.json(listTodoMockData);
  }),

  http.post(getApiUrl("posts"), () => {
    console.log("post posts");
    return HttpResponse.json(addTodoMockData);
  }),
];