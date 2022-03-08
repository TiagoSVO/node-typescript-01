import knex from "../database/connection";
import path from 'path';
import { Router } from 'express';

const itemsRouter = Router();

itemsRouter.get('/', async (request, response) => {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
        return {
            id: item.id,
            title: item.title,
            url_image: `http://localhost:3333/uploads/${item.image}`
        }
    })
    return response.status(200).json(serializedItems);
})

itemsRouter.post('/', async (request, response) => {
    const {
        title,
        image
    } = request.body

    const transaction = await knex.transaction();

    const newItem = {
        title,
        image
    }

    const newId = await transaction('items').insert(newItem);

    transaction.commit();

    return response.status(200).json({
        id: newId[0],
        ...newItem
    })
})

export default itemsRouter;