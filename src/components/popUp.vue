<script>
export default {
    props: {
        messages: Array
    },
    data() {
        return {
            isVisible: false,
        }
    },
    methods: {
        clickedBtn() {
            this.isVisible = !this.isVisible 
        }
    }
}
</script>

<template>
    <div>
        <div class="popUpBtn d-flex mx-4" @click="clickedBtn">
            ?
            <div class="popUp d-flex align-items-start" v-if="isVisible">
                <p class="d-flex" v-for="(message, index) in messages" :key="index">
                    {{ message}}
                </p>
            </div>
        </div>
    </div>
</template>

<style>
 
.popUpBtn {
    width: 25px;
    height: 25px;
    background-color: rgb(154, 154, 154);
    border-radius: 5px;
}

.popUp {
    width: 233; 
    height: 400;
    background-color: rgba(200, 62, 62, 0.46);
    border-radius: 5px;
    margin-left: 50px;
}
</style>