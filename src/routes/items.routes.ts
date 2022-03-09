import knex from "../database/connection";
import { Router, Request, Response } from 'express';
import { configMulterItems } from '../configs/multer';
import multer from 'multer';
import path from 'path';
import { removeFile } from "../utils";

const itemsRouter = Router();

const upload = multer(configMulterItems);

itemsRouter.get('/', async (request: Request, response: Response) => {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
        return {
            id: item.id,
            title: item.title,
            url_image: `http://localhost:3333/uploads/${item.image}`
        }
    })
    return response.status(200).json(serializedItems);
});

itemsRouter.post('/', upload.single('image'), async (request: Request, response: Response) => {
    const {
        title
    } = request.body

    const transaction = await knex.transaction();

    const newItem = {
        title,
        image: request.file?.filename
    }

    const newId = await transaction('items').insert(newItem);

    await transaction.commit();

    if(transaction.isCompleted()) {
        return response.status(200).json({
            id: newId[0],
            ...newItem
        })
    } else {
        removeFile(path.join(`${request.file?.destination}`, `${request.file?.filename}`));
        return response.status(500).json({error: "An error ocorred while inserting new item. Try to insert it again later or contact support."})
    }
});

itemsRouter.put('/:id', upload.single('image'), async (request: Request, response: Response) => {
    const { id } = request.params;
    
    const {
        title
    } = request.body;

    const transaction = await knex.transaction();

    const itemToUpdate = await transaction('items').where('id', id).first();

    if(!itemToUpdate) {
        transaction.rollback();
        return response.status(404).json({ message: 'Item not found!' });
    }

    const image = request.file?.filename;

    const updatedItem = {
        ...itemToUpdate,
        image
    }

    await transaction('items').update(updatedItem).where('id', id);

    await transaction.commit();

    if(transaction.isCompleted()) {
        removeFile(path.join(`${request.file?.destination}`, `${request.file?.filename}`));
        return response.status(200).json(updatedItem)
    } else {
        return response.status(500).json({error: "An error ocorred while updating item. Try to update it again later or contact support."})
    }
});

itemsRouter.delete('/:id', async (request: Request, response: Response) => {
    const { id } = request.params;

    const transaction = await knex.transaction();

    const itemToDelete = await transaction('items').where('id', id).first();

    if(!itemToDelete) {
        return response.status(404).json({message: 'Item not found!'})
    }

    await transaction('items').where('id', id).del();

    await transaction.commit();

    if(transaction.isCompleted()) {
        removeFile(path.join(__dirname, '..', '..', 'uploads', String(itemToDelete.image) ));
        return response.status(200).json({ message: `The item "${itemToDelete.title}" was removed successfully.`});
    } else {
        return response.status(500).json({ error: "An error ocorred while updating item. Try to update it again later or contact support." });
    }
})

export default itemsRouter;