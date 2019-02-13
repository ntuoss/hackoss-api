export type LINK_TYPE = 'ask' | 'content' | 'feedback' 
export class RebrandlyLink{
    title: string
    destination: string
    type: LINK_TYPE
}