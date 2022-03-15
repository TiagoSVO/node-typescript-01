import { Router } from 'express';
import knex from "../database/connection";
import multer from 'multer';
import { configMulterLocations } from '../configs/multer';
import { removeFile } from '../utils';
import path from 'path';

const upload = multer(configMulterLocations)

const locationsRouter = Router();

locationsRouter.get('/', async (request, response) => {
    let queryString = 'SELECT * FROM LOCATIONS L'
    
    const permitedKeys = ['city', 'items']
    const queryKeys:Array<string> = Object.keys(request.query)
    const keysLength:number = queryKeys.length

    const { items } = request.query
    const parsedItems = String(items).split(',').map(item => Number(item.trim()))

    if(queryKeys.indexOf('items') > -1) {
        queryString = 'SELECT L.*, LI.ID FROM LOCATIONS L'
        queryString += " INNER JOIN LOCATION_ITEMS LI \
        ON L.id = LI.location_id"
    }

    if(keysLength > 0){
        queryString += " WHERE "
        for(const key of queryKeys){
            if(permitedKeys.indexOf(key) > -1) {
                if(queryKeys.indexOf(key) !== 0) queryString += ' AND '
                if(key !== 'items') {
                    queryString += `L.${key}='${request.query[key]}'`
                } else {
                    queryString += `LI.id IN (${parsedItems.join(', ')})`
                }
            }
        }
        
    } 

    const locations = await knex.raw(queryString)

    const serializedLocations = async () => { 
        return Promise.all( locations.map( async (location:any) => {
            const locationItems = await knex('items')
                                        .join('location_items', 'items.id', '=', 'location_items.item_id')
                                        .where('location_items.location_id', location.id)
                                        .select('*')
            return {...location, items: locationItems} 
        }))
    }

    const localizationsWithItems = await serializedLocations()

    return response.status(200).json({ locations: localizationsWithItems, message: 'Method GET Locations' })
})

locationsRouter.post('/', upload.single('image'), async (request, response) => {
    const { 
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    }  = request.body

    const transaction = await knex.transaction()

    const newLocation = {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        image: request.file?.filename
    }
    
    const newId = await transaction('locations').insert(newLocation)

    await transaction.commit();

    if(transaction.isCompleted()) {
        return response.status(200).json({
            id: newId[0],
            ...newLocation
        })
    } else {
        removeFile(path.join(`${request.file?.destination}`, `${request.file?.filename}`));
        return response.status(500).json({error: "An error ocorred while inserting new location. Try to insert it again later or contact support."})
    }
})

export default locationsRouter