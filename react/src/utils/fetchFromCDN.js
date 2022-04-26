export const fetchJsFromCDN = async (src, externals = []) => {

  return new Promise((resolve, reject) => {

    const returnResolve = () => resolve(externals.map(key => {
      const ext = window[key]
      typeof ext === 'undefined' && console.warn(`No external named '${key}' in window`)
      return ext
    }))

    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length; i--;) {
      if (scripts[i].src == src) {
        console.log("Already present", src)
        return returnResolve()
      };
    }
    console.log("FETCHING", src)
    const script = document.createElement('script')
    script.setAttribute('src', src)

    script.addEventListener('load', () => {
      return returnResolve()
    })
    script.addEventListener('error', reject)
    document.body.appendChild(script)
  })
}