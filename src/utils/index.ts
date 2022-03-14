import fs, { PathLike } from 'fs'

export const removeFile = (filePath: PathLike):void => {
    fs.unlink(filePath, (error) => {
        if (error) throw error;
        console.log(`${filePath} was removed!`)
    })
};

export const randomNumber = (num: number) => {
    return Math.floor(Math.random()*num)
}

export const selectArrayRandomItem = (arrayItems: Array<any>):any => {
    return arrayItems[randomNumber(arrayItems.length)]
}

export const selectArrayRandomItems = (arrayItems: Array<any>, qtd: number=1):Array<any> => {
    if(arrayItems.length < 1) {
        return []
    }
    
    let items = [...arrayItems]
    let selectedItems:any = []

    qtd = qtd < 0 ? 1 : qtd

    for(let i=0; i<qtd; i++) {
        const selectedItem = selectArrayRandomItem(items)
        items = items.filter(item => item !== selectedItem)
        selectedItems.push(selectedItem)
    }

    return selectedItems
}