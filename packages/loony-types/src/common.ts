export enum ApiEvent {
    INIT,
    START,
    SUCCESS,
    FAILED,
    IDLE,
}
  
export const UNAUTHORIZED = 300;
export const AUTHORIZED = 105;

export type BooleanDispatchAction = React.Dispatch<React.SetStateAction<boolean>>;
export type VoidReturnFunction = () => void;