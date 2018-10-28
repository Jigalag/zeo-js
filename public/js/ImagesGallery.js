window.ImageGallery = (function () {
    class ImageGallery {
        /**
         * @constructor
         * @param {ImagesResolver} imagesResolver
         */
        constructor(imagesResolver) {
            this.imagesResolver = imagesResolver;
            this.searchModuleId = 'local';
            this._initView();
            this._initViewFunctionality();
            this.apiResult = [];
            this.searchModule = {
                'local': window.localDB,
                'pixabay': this.apiResult
            };
        }

        /**
         * @param {String} query
         * @param {String} searchModuleId
         */
        search(query, searchModuleId) {
            this.searchModuleId = searchModuleId;
            if (!query || query && query.length === 0) {
                return {
                    query: '',
                    images: []
                }
            }
            if (!this.searchModule[this.searchModuleId]) {
                throw 'Module id is unknown';
            }

            if (this.searchModuleId === 'local') {
                const searchResults = this.imagesResolver.search(query);
                this._onReceiveSearchResult(searchResults);
            } else {
                this.imagesResolver.getRequest(query).then(res => {
                    this._onReceiveSearchResult(res);
                });
            }
        }

        addToElement(element) {
            element.appendChild(this.container);
        }

        _onUserSearch(ev) {
            ev.preventDefault();
            this.searchModuleId = this.searchSelect.value;
            this.search(this.seachInput.value, this.searchModuleId);
        }

        _onReceiveSearchResult(result) {
            this.searchResults.innerHTML = "";
            const imagesInfo = result.images;

            imagesInfo.forEach((image) => {
                const imgNode = document.createElement('img');
                imgNode.setAttribute('src', image.url);
                this.searchResults.appendChild(imgNode);
            });
        }

        _initView() {
            this.container = document.createElement("div");
            this.container.className = "gallery";

            this.form = document.createElement("form");
            this.form.className = "gallery__form form-inline";
            this.container.appendChild(this.form);

            this.formGroup = document.createElement("div");
            this.formGroup.className = "form-group";
            this.form.appendChild(this.formGroup);

            this.seachInput = document.createElement("input");
            this.seachInput.className = "gallery__search form-control";
            this.seachInput.placeholder = "search by tag";
            this.formGroup.appendChild(this.seachInput);

            this.searchSelect = document.createElement("select");
            this.searchSelect.className = "gallery__select form-control";
            this.localOption = document.createElement("option");
            this.apiOption = document.createElement("option");
            this.localOption.text = 'Local';
            this.localOption.value = 'local';
            this.apiOption.text = 'Pixabay';
            this.apiOption.value = 'pixabay';
            this.searchSelect.appendChild(this.localOption);
            this.searchSelect.appendChild(this.apiOption);
            this.form.appendChild(this.searchSelect);

            this.searchButton = document.createElement("button");
            this.searchButton.className = "gallery__button btn btn-primary";
            this.searchButton.innerText = "search";
            this.form.appendChild(this.searchButton);

            this.searchResults = document.createElement("div");
            this.searchResults.className = "gallery__result";
            this.container.appendChild(this.searchResults);
        }

        _initViewFunctionality() {
            this.form.addEventListener("submit", this._onUserSearch.bind(this));
        }
    }

    return ImageGallery;
})();