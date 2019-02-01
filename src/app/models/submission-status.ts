export enum SubmissionStatus {
    Draft = 'Draft',
    Submitted = 'Submitted',
    Processing = 'Processing',
    Completed = 'Completed'
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
