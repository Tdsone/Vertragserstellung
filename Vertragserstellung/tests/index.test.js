import {replacePlaceHolders} from '../utils'

test("Tests if all placeholders are replaced correctly", () => {
    
    const placeholderValueMap = new Map([["++name++","Rudolf"],["++volume++","12"], ["++kommtnichtvor++","troelf"]])
    const text = "Der Hahn mit Namen ++name++ schrie mit Lautstärke ++volume++. Allerdings hatte ++name++ einen Brotkrumen im Hals und erstickte in Folge daran."
    
    expect(replacePlaceHolders(text, placeholderValueMap)).toBe("Der Hahn mit Namen Rudolf schrie mit Lautstärke 12. Allerdings hatte Rudolf einen Brotkrumen im Hals und erstickte in Folge daran.")
})