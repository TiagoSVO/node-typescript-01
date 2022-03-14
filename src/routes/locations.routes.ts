import { query, Router } from 'express'
import knex from "../database/connection";


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

locationsRouter.post('/', async (request, response) => {
    const { locationData } = request.body
    return response.status(200).json({ message: 'Location created successfuly' })
})

export default locationsRouter
