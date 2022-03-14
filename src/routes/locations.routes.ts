import { Router } from 'express'
import knex from "../database/connection";

const locationsRouter = Router();

locationsRouter.get('/', async (request, response) => {
    const locations = await knex('locations').select('*');
    return response.status(200).json({ locations, message: 'Method GET Locations'})
})

export default locationsRouter;