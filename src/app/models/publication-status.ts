export enum PublicationStatus {
    Unknown,
    InPreparation,
    Submitted,
    Published
}

export namespace PublicationStatus {

    export function values() {
        return Object.keys(PublicationStatus).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }
}
