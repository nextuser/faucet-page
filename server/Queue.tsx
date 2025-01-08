export const  dataSet = new Set<string>();
type  ElementType= string 
export function addData(data:ElementType){
    dataSet.add(data);
}
export function deleteData(data:ElementType){
    dataSet.delete(data);
}
export function getDataSize(){
    return dataSet.size;
}