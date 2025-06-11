import {Document} from './document.mjs';

export class Process
{
    constructor(req, githubToken)
    {
        this.req = req;
        
        this.url = req.body.repository.url;
        this.added = req.body.head_commit.added || [];
        this.removed = req.body.head_commit.removed || [];
        this.modified = req.body.head_commit.modified || [];
        this.before = req.body.before;
        this.after = req.body.after;
        this.githubToken = githubToken;
        
    }

    async processRemoved() {
        for (const doc of this.removed) {
          // Aquí eliminás todos los fragmentos del documento de OpenSearch por nombre
          console.log(`Eliminar documento de OpenSearch: ${doc}`);
        }
    }
    async processAdded() {
        for (const doc of this.added) {
            console.log(`Agregar documento nuevo: ${doc}`);
            const url = `${this.url}/contents/${doc}?ref=${this.after}`;
            const docNew = new Document(url, doc);
            await docNew.getMarkdownFile(this.githubToken);

            // Agregás los fragmentos a OpenSearch

            docNew.processFragments();
            
        }
    }
    async processModified() {
        for (const doc of this.modified) {
            const urlOld = `${this.url}/contents/${doc}?ref=${this.before}`;
            const urlNew = `${this.url}/contents/${doc}?ref=${this.after}`;
            
            const docOld = new Document(urlOld, doc);
            const docNew = new Document(urlNew, doc);
            
            await Promise.all([
                docOld.getMarkdownFile(this.githubToken, doc),
                docNew.getMarkdownFile(this.githubToken, doc)
            ]);
            // Comparar firmas y agregar/quitar en OpenSearch
            console.log(`Modificar documento: ${doc}`);
            
            docOld.processFragments();
            docNew.processFragments();
            
            this.checkSigns(docOld, docNew);
            
        }
    }

    checkSigns(docOld, docNew) {
        // Crear sets con las firmas de los fragmentos
        const signsOld = new Set(docOld.fragments.map(f => f.sign));
        const signsNew = new Set(docNew.fragments.map(f => f.sign));
    
        // --- Detectar fragmentos eliminados (estaban antes, no están ahora) ---
        const removed = docOld.fragments.filter(f => !signsNew.has(f.sign));
    
        // --- Detectar fragmentos agregados (están ahora, no estaban antes) ---
        const added = docNew.fragments.filter(f => !signsOld.has(f.sign));
    
        // --- Detectar fragmentos sin cambios (opcional) ---
        const unchanged = docNew.fragments.filter(f => signsOld.has(f.sign));

        //Ignore unchanged
        for (const frag of unchanged) {
            console.log('Ignore Fragment sign:', frag.sign);
            console.log(frag.toJSON());
            //openSearchClient.delete({ id: sign })
        }
    
        // Procesar eliminados
        for (const frag of removed) {
            console.log('Remove Fragment sign:', frag.sign);
            console.log(frag.toJSON());
            //openSearchClient.delete({ id: sign })
        }
    
        // Procesar agregados
        for (const frag of added) {
            console.log('add Fragment sign:', frag.sign);
            console.log(frag.toJSON());
            //openSearchClient.index({ body: frag.toJSON()
        }
    }



    async run() {
        await this.processRemoved();
        await this.processAdded();
        await this.processModified();
    }    
}

