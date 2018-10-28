// function getRequest(path) {
//     return fetch(path, {method: 'GET'}).then(result => {
//         return result.json();
//     })
// }

window.ImagesResolver = (function () {
    // const http = require('http');
    const key = '10455375-b91aa8883d21d7529ed180e5b';
    class ImagesResolver {
        constructor() {
        }

        prepareResult(result) {
            let preparedResult = [];
            console.log(result);
            result.forEach((item) => {
                preparedResult.push({
                    'id': item.id,
                    'url': item.previewURL,
                    'tags': item.tags
                })
            });
            return preparedResult;
        }

        async getRequest(query){
            let path = `https://pixabay.com/api/?key=${key}&q=${query}&image_type=photo&per_page=100`;
            const response = await fetch(path);
            const data = await response.json();
            let images = this.prepareResult(data['hits']);
            return {
                query: query,
                images: images
            };
        }

        search(query) {
            let resultArray = window.localDB.filter((item) => {
                let tags = item.tags.split(', ');
                return tags.indexOf(query) !== -1
            });
            let images = this.prepareResult(resultArray);
            return {
                query: query,
                images: images
            };
        }
    }

    return ImagesResolver;
})();