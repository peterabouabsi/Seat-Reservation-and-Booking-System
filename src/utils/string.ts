export const split = (value: string, splitOn: string = ','): string[] => {
    if(typeof value !== 'string')
        return String(value).replaceAll('/\s/g',  '').split(splitOn)
    
    return value.replaceAll('/\s/g',  '').split(splitOn);
}