<template>
	<div class='container'>
		<div class="keyboard">
            <div v-for='row, index in keyboard' :key='row[index]' class='row'>
                <div v-for='key, index in row' :key='key + index' class='key-wrapper'>
                    <div
                        @click="$emit('keyboardClick', key)"
                        class="key"
                        :class="{
                            'green' : keyboardState.correct.includes(key),
                            'orange' : keyboardState.close.includes(key),
                            'grey' : keyboardState.incorrect.includes(key)
                        }"
                    >
                        {{key}}
                    </div>
                </div>
            </div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Keyboard',
    props: ['keyboard', 'keyboardState'],
	data() {
		return {
			
		};
	},
    methods: {

    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.row {
    width: 100%;
    height: 100%;

    display: flex;
}

.key-wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
}

.key {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 90%;
    width: 85%;

    border-radius: 4px;

    cursor: pointer;
    user-select: none;

    font-weight: bold;
    text-transform: uppercase;
    color: black;
    background: #d3d6da;
}

/* perhaps redundant CSS for the keyboard keys */
.green {
	border-color: #6aaa64;;
	background: #6aaa64;;
	color: white;	
}

.orange {
	border-color: #c9b458;
	background: #c9b458;
	color: white;
}

.grey {
	border-color: grey;
	background: grey;
	color: white;
}

.container {
    width: 100%;
}

.keyboard {
	height: 200px;
	width: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

	margin-top: auto;
	margin-bottom: 10px;
}


</style>
