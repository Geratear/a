/**
 * main.js for note-blog
 * @author ahuigo
 */
const $ = document.querySelector.bind(document);
function disqus() {
    if (!window.DISQUS) {
        var d = document, s = d.createElement('script');
        s.src = `https://${config.disqus_user}.disqus.com/embed.js`;
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
        s.onload = function () {
            console.log('onload disqus')
            disqus_reset()
        }
    } else {
        disqus_reset()
    }
}
function disqus_reset() {
    if (window.DISQUS) {
        DISQUS.reset({
            reload: true,
            config: function () {
                this.page.url = window.location.href.replace('#', '#!');
                this.page.identifier = window.location.hash.slice(1);
                this.page.title = document.title;
            }
        });
    }
}

Vue.component('tree-folder', {
    template: '#tree-folder',
    props: ['nodes', 'show'],
    methods: {
        openFolder(file) {
            if (!file.nodes) {
                file.show = true
                Vue.set(file, 'nodes', [{ type: 'file', name: "loading...", path: '' }]);
                this.$root.fetchFolder(file)
            } else {
                Vue.set(file, 'show', !file.show);
            }
        },
    },
});

marked.setOptions({
    gfm: true,
    breaks: true,
    sanitize: false,
    latexRender: katex.renderToString.bind(katex),
});

const mdConponent = {
    template: '#md',
    data() {
        return {
            md: '',
        }
    },
    props: [],
    watch: {
        '$route'(to, from) {
            this.fetchMd()
        }
    },
    mounted: function () {
        console.log('mounted')
        this.$nextTick(function () {
        })
    },
    updated() {
        console.log('updated')
        document.querySelectorAll('pre code').forEach(function (e) {
            return hljs.highlightBlock(e, '    ');
        });
        const toc = document.querySelector('#toc');
        if (toc.children.length) {
            toc.children[0].replaceWith(createToc(this.$el))
        } else {
            toc.appendChild(createToc(this.$el))
        }
        //disqus reset
        const h1node = $('#content h1')
        if(h1node){
            h1node.style.cssText += 'color: #007998; text-align:center; border-bottom:1px solid'
            var title = h1node.innerText.split(' ', 2)[1]
            document.title = h1node.innerText = title
        }
        disqus()
    },
    methods: {
        fetchMd() {
            var path = this.$route.path
            if(path === '/'){
                path = 'README.md';
            }
            fetch(path).then(response => {
                response.text().then(data => {
                    if (data.substr(0, 4) === '---\n') {
                        var pos = data.substr(0, 300).nthIndex('---\n', 2)
                        data = data.substr(pos);
                    }
                    data = data.replace(/\n/g, '\t\n')
                    this.md = data
                })
            })
        },
        marked: function (text) {
            console.log('marked text')
            return marked(text)
        },
    },
    created() {
        console.log('before created')
        this.fetchMd()
    },
}

const router = new VueRouter({
    routes: [
        { path: '/bar', component: { template: '<div>bar</div>' } },
        { path: '/*', component: mdConponent },
    ],
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 }
    },
});

const app = new Vue({
    router,
    data: {
        nodes: [],
        path: 'post',
        show: true,
        showMenu: false,
        config:config,
    },
    methods: {
        fetchFolder(file) {
            var v = localStorage.getItem(file.path) || '{}'
            var data = JSON.parse(v)
            if (data && data.time && new Date - data.time < 86400 * 1000) {
                console.log('from cache')
                Vue.set(file, 'nodes', data.nodes);
                return;
            }
            return fetch(`https://api.github.com/repos/${config.user}/a/contents/` + file.path, {
            }).then(r => r.json()).then(data => {
                let nodes = data.map(v => ({ name: v.name, path: v.path, type: v.type, show: true }))
                    .filter((v) =>
                        !(
                            v.type == 'dir'
                            && ['ai', 'atom'].includes(v.name)
                        )
                    );
                Vue.set(file, 'nodes', nodes);
                localStorage.setItem(file.path, JSON.stringify({ time: +new Date, nodes }))
                return [null, nodes]
            }).catch(err => {
                console.log([err])
                return [err]
            })
        },
        openShare(site, o) {
            var link;
            const title = window.encodeURIComponent(document.title)
            const url = window.encodeURIComponent(location.href)
            if (site === 'twitter') {
                link = `http://twitter.com/share?text=${title}&url=${url}`;
            } else {
                link = `http://service.weibo.com/share/share.php?url=${url}&title=${title}`;
            }
            window.open(link, site + ' share', 'width=550,height=235');
            return false;
        },
    },
    created: function () {
        this.fetchFolder(this.$data)
    }
}).$mount('#app')
