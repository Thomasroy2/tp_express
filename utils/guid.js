
module.exports = {
    generateUid: () => {
        generatePart = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)
        }
        return generatePart() + generatePart() + '-' +  generatePart() + '-' +  generatePart() + '-' +
                generatePart() + '-' +  generatePart() + generatePart() + generatePart();
    },
};