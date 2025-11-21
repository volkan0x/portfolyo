import axios from 'axios'

export const queryParse = (search = window.location.search) => {
  if (!search) return {}
  const queryString = search[0] === '?' ? search.substring(1) : search
  const query = {}
  queryString
    .split('&')
    .forEach(queryStr => {
      const [key, value] = queryStr.split('=')
      /* istanbul ignore else */
      if (key) query[decodeURIComponent(key)] = decodeURIComponent(value)
    })

  return query
}

export const queryStringify = query => {
  const queryString = Object.keys(query)
    .map(key => `${key}=${encodeURIComponent(query[key] || '')}`)
    .join('&')
  return queryString
}

export const axiosJSON = axios.create({
  headers: {
    'Accept': 'application/json'
  }
})

export const axiosGithub = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Accept': 'application/json'
  }
})

export const getMetaContent = (name, content) => {
  /* istanbul ignore next */
  content || (content = 'content')
  /* istanbul ignore next */
  const el = window.document.querySelector(`meta[name='${name}']`)
  /* istanbul ignore next */
  return el && el.getAttribute(content)
}

export const formatErrorMsg = err => {
  let msg = 'Error: '
  if (err.response && err.response.data && err.response.data.message) {
    msg += `${err.response.data.message}. `
    err.response.data.errors && (msg += err.response.data.errors.map(e => e.message).join(', '))
  } else {
    msg += err.message
  }
  return msg
}

export const hasClassInParent = (element, ...className) => {
  /* istanbul ignore next */
  let yes = false
  /* istanbul ignore next */
  if (typeof element.className === 'undefined') return false
  /* istanbul ignore next */
  const classes = element.className.split(' ')
  /* istanbul ignore next */
  className.forEach((c, i) => {
    /* istanbul ignore next */
    yes = yes || (classes.indexOf(c) >= 0)
  })
  /* istanbul ignore next */
  if (yes) return yes
  /* istanbul ignore next */
  return element.parentNode && hasClassInParent(element.parentNode, className)
}

// import axios, { AxiosInstance } from 'axios'

// export const queryParse = (search: string = window.location.search): Record<string, string> => {
//   if (!search) return {}
//   const queryString = search[0] === '?' ? search.substring(1) : search
//   const query: Record<string, string> = {}
//   queryString
//     .split('&')
//     .forEach(queryStr => {
//       const [key, value] = queryStr.split('=')
//       /* istanbul ignore else */
//       if (key) query[decodeURIComponent(key)] = decodeURIComponent(value || '')
//     })

//   return query
// }

// export const queryStringify = (query: Record<string, unknown>): string => {
//   const queryString = Object.keys(query)
//     .map(key => `${key}=${encodeURIComponent(String(query[key] || ''))}`)
//     .join('&')
//   return queryString
// }

// export const axiosJSON: AxiosInstance = axios.create({
//   headers: {
//     'Accept': 'application/json'
//   }
// })

// export const axiosGithub: AxiosInstance = axios.create({
//   baseURL: 'https://api.github.com',
//   headers: {
//     'Accept': 'application/json'
//   }
// })

// export const getMetaContent = (name: string, content: string = 'content'): string | null => {
//   /* istanbul ignore next */
//   const el = window.document.querySelector<HTMLMetaElement>(`meta[name='${name}']`)
//   /* istanbul ignore next */
//   return el && el.getAttribute(content)
// }

// export const formatErrorMsg = (err: any): string => {
//   let msg = 'Error: '
//   if (err && err.response && err.response.data && err.response.data.message) {
//     msg += `${err.response.data.message}. `
//     if (Array.isArray(err.response.data.errors)) {
//       msg += err.response.data.errors.map((e: any) => e.message).join(', ')
//     }
//   } else if (err && err.message) {
//     msg += err.message
//   } else {
//     msg += String(err)
//   }
//   return msg
// }

// type ElementWithClass = Element & { className?: string }

// /**
//  * Checks whether an element or any of its parents contains one of the provided class names.
//  * @param element starting element
//  * @param className one or more class names to test
//  */
// export const hasClassInParent = (element: ElementWithClass | null, ...className: string[]): boolean => {
//   /* istanbul ignore next */
//   if (!element) return false
//   /* istanbul ignore next */
//   if (typeof element.className === 'undefined') return false
//   /* istanbul ignore next */
//   const classes = (element.className || '').split(' ').filter(Boolean)
//   /* istanbul ignore next */
//   const yes = className.some(c => classes.indexOf(c) >= 0)
//   /* istanbul ignore next */
//   if (yes) return true
//   /* istanbul ignore next */
//   return element.parentNode ? hasClassInParent(element.parentNode as ElementWithClass, ...className) : false
// }