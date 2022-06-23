import {KeyWordsInterface} from "../../shared/services-interfaces/detail-service/key-words.interface";

export interface AdminUpdateKeyWords {
  id: number
  keyWord: string
}

export interface AdminGetKeyWords {
  items: KeyWordsInterface[]
  count: number
}
