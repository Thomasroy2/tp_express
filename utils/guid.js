
module.exports = {

    generateUid: () => {

        generatePart = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16) // To string in hexa to get number & letter
            .substring(1) // Cut the first character to only get 4 at a time
        }

        return generatePart() + generatePart() + '-' +  generatePart() + '-' +  generatePart() + '-' +
                generatePart() + '-' +  generatePart() + generatePart() + generatePart()
    }

}