export enum SubmissionStatus {
    Draft,
    Submitted,
    Processing,
    Completed
}

export namespace SubmissionStatus {

    export function values() {
        return Object.keys(SubmissionStatus).filter(
            (type) => isNaN(<any>type) && type !== 'values'
        );
    }

    export function isEditableStatus(currentStatus: string) {
        return SubmissionStatus[currentStatus] === SubmissionStatus.Draft;
    }
}
