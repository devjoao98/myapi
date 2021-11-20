const fs = require('fs')

const buildCompile = ({ base_path }) => {
  return (path, values = {}) => {
    const basePath = base_path || __dirname

    const data = fs.readFileSync(`${basePath}/${path}`, 'utf-8')
    
    let html = data.toString()

    for(let [key, value] of Object.entries(values)) {
      html = html.replace("{"+key+"}", value)
    }
  
    return html;
  }
}

module.exports = buildCompile;