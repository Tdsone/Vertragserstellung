function replacePlaceHolders(text : string, placeholderValueMap: Map<string, string>) : string {
    
    let modifiedText = text;

    // replaces all occurences of placeholder with value in text
    for(let [placeholder, value] of placeholderValueMap.entries()){
        const re = new RegExp(placeholder, "g")
        modifiedText = modifiedText.replace(re, value)
    }

    return modifiedText
}

export {
    replacePlaceHolders
}