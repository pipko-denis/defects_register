<template>
    <v-container grid-list-sm fluid>
        <v-layout row wrap>
            <!--
            <v-flex xs12>
                <v-btn rised class="primary" @click="onPickFile">Upload image</v-btn>
                <input type="file" style="display: none" ref="fileInput" accept="image/*" @change="onFilePicked">
                <img :src="imageUrl" aspect-ratio="1">

                <v-btn rised class="primary" @click="onPickFiles">Upload images</v-btn>
                <input type="file" style="display: none"  ref="filesInput" accept="image/*" multiple @change="onFilesPicked">
                <v-btn rised class="primary" @click="sendFile">Send single file</v-btn>
                
            </v-flex>
                
            <v-flex v-for="img in images" :key="img.id" xs4 sm3 md2 d-flex>                                    
                <v-card flat tile class="d-flex" aspect-ratio="1">
                    <img :src="img.imageUrl" height="150px" width="150px">
                    <v-btn outline small absolute bottom right fab color="primary" class="mb-4" @click.prevent="removePic(img)"><v-icon>delete</v-icon></v-btn>
                    <template v-slot:placeholder>
                        <v-layout fill-height align-center justify-center ma-0 >
                            <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                        </v-layout>
                    </template>
                </v-card>
            </v-flex> 
            -->
        </v-layout>    
    </v-container>

</template>

<script>

import ImageService from '@/services/ImageService'

    export default {
        data: () => {
            return {
                imageUrl: null,
                image: null,
                images:[],
                fileObject:null,
            }
        },
        mounted() {
            if (!this.$store.getters.getIsAuth) {
                this.$router.push("/signin")            
            }
        },

        computed: {
            files(){

            } 
        },

        methods:{
            onPickFile(){
                this.$refs.fileInput.click()
            },
            onFilePicked(event){
                const files = event.target.files
                let filename = files[0].name
                if (filename.lastIndexOf(".") <=0){
                    return alert("Choose valid file!")
                }
                const fileReader = new FileReader()
                fileReader.addEventListener('load', () =>{
                    this.imageUrl = fileReader.result
                })
                fileReader.readAsDataURL(files[0])
                this.image = files[0]
            },
            onPickFiles(){
                this.$refs.filesInput.click()
            },

            onFilesPicked(event){
                let fl = event.target.files
                console.info('onFilesPicked', fl)
     
                for(let i=0;i<fl.length;i++){
                    //console.info('file', fl[i])
                    let fileReader = new FileReader()
                    fileReader.addEventListener('load',() => {   
                        let elem = _.find(this.images,{id: fl[i].name})                         
                        if (!elem) this.images.push({imageUrl: fileReader.result,id: fl[i].name,file: fl[i]})                        
                    })
                    fileReader.readAsDataURL(fl[i])                    
                }
            },
            removePic(img){
                let ind = this.images.indexOf(img)
                this.images.splice(ind,1)
                console.info('removePic', ind)
            },
            async sendFile(){
                if (! this.image) return console.log('image is empty')
                const formData = new FormData()
                formData.append('defectImage',this.image);
                formData.append('defectid',1);                
                try {
                    await ImageService.saveImage(formData)
                } catch (error) {
                    console.log('ERROR', error)
                }

            }
        }
    }
</script>

<style scoped>

</style>