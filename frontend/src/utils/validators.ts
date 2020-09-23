export const isValidEmailAddress = (email: string): boolean => {
    const validEmailRegex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return validEmailRegex.test(email);
};

export const isValidImageType = (type: string): boolean => {
    const imgRegex = new RegExp('image/*')
    return imgRegex.test(type);
}