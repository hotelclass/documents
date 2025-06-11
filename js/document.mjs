import axios from 'axios';
import matter from 'gray-matter';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import {Fragment} from './fragment.mjs';

export class Document {
    constructor(url, name) {
        this.url = url;
        this.document = '';
        this.fragments = [];
        this.metadata = {};
        this.content = '';
        this.tree = null;        
        this.fragments = [];
        this.name = name;
    }

    async getMarkdownFile(githubToken) {
        try {
            const response = await axios.get(this.url, {
              headers: {
                Authorization: `token ${githubToken}`,
                Accept: 'application/vnd.github.v3.raw+json',
                'User-Agent': 'Node.js App'
              }
            });
            
            //const markdown = Buffer.from(response.data.content, 'base64').toString('utf8'); // decodificamos el base64
            this.document = response.data;
            
            console.log('Contenido del archivo OK');
            //console.log(markdown);
            this.getTree();
            return this.document;
        } catch (error) {
            console.error('Error al obtener el archivo:', error.response?.data || error.message);
            throw error;
        }
    }
    getTree()
    {
        const parsed = matter(this.document); // extrae metadatos y contenido
        this.metadata = parsed.data;
        //console.log('doc gettree metadata', this.metadata);
        this.content = parsed.content;
        this.tree = unified().use(remarkParse).parse(this.content);
        //console.log('doc gettree tree', this.tree);
    }
    #extractFragments() {
        const tree = this.tree; // ya parseado antes con unified + remark-parse
        const nodes = tree.children; // array plano de nodos
        //console.log('doc extractFragments nodes', nodes);
        let current = []; // fragmento actual que vamos construyendo
        
        for (let node of nodes) {
            if (node.type === 'heading' && node.depth === 1) {
                // Si ya hay un fragmento armado, lo guardamos
                if (current.length > 0) {
                    //console.log('doc new fragment', current);
                    this.fragments.push(new Fragment(current, this.name));
                }
                // Empezamos nuevo fragmento con el nodo de título actual
                current = [node];
            } else {
                // Seguimos agregando nodos al fragmento actual
                current.push(node);
            }
        }
    
        // Al final del recorrido, puede quedar un último fragmento sin guardar
        if (current.length > 0) {
            this.fragments.push(new Fragment(current, this.name));
        }
        // Lo guardamos en this.fragments
        //this.fragments = fragments;
    }

    processFragments()
    {
        //console.log('Process fragments');
        this.#extractFragments();
        this.fragments.forEach(fragment => {
            fragment.process();
        });
    }
}

