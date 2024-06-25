import { rest } from 'msw';
import {searchResults, dishInformation} from '../mockFetch.js';

export const history=  [];

export const handlers = [
    rest.get('https://brfenergi.se/iprog/group/200/recipes/complexSearch', (req, res, ctx) => {
	history.push(req);
    return res(
      ctx.delay(10),
      ctx.status(200),
      ctx.json({
        number: 3,
        offset: 0,
        results: searchResults,
        totalResults: 100
      })
    );
  }),
  rest.get('https://brfenergi.se/iprog/group/200/recipes/informationBulk', (req, res, ctx) => {
      history.push(req);
    return res(
      ctx.delay(10),
      ctx.status(200),
      ctx.json([dishInformation])
    );
  }),
    rest.get('*', (req, res, ctx) => {
	history.push(req);
    return res(
      ctx.status(200),
      ctx.json({
        data: 'Mocked data response for any URL'
      })
    );
  })
];
