<template>
    <v-layout justify-space-around row wrap>
        <v-flex xs10 pl-3>
            <AutoCompleteTextInput :input-p="final_transcript" v-if="inputType === 'text'"></AutoCompleteTextInput>
        </v-flex>
        <v-flex xs2 justify-center row wrap>
            <div style="margin-top: 15%">
                <v-btn
                        dark
                        @mousedown.stop.prevent="onMouseDown"
                        @mouseup.stop.prevent="onMouseUp"
                        icon
                        :color="!toggle ? '#21dc78' : (speaking ? '#de4540' : '#de5069')"
                >
                    <img :src="showSend ? sendUrl :micUrl " alt="" width="16px" height="16px">
                </v-btn>
            </div>

        </v-flex>

    </v-layout>
</template>

<script>
  import AutoCompleteTextInput from './AutoCompleteTextInput.vue?shadow';
  import AudioInput from './AudioInput.vue?shadow';
  import { mapActions, mapState } from 'vuex';

  let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = SpeechRecognition ? new SpeechRecognition() : false;

  export default {
    name: 'InputBox',
    data: function() {
      return {
        dataUrl: '',
        sendUrl: null,
        micUrl: null,
        error: false,
        speaking: false,
        toggle: false,
        runtimeTranscription: '',
        sentences: [],
        lang: 'en-US',
        final_transcript: '',
        interim_transcript: '',
      };
    },
    components: {
      AutoCompleteTextInput,
      AudioInput,
    },
    methods: {
      ...mapActions(['sendUserMessage', 'changeInputText', 'clearInput']),
      onMouseUp() {
        if (this.showSend) {
          this.sendUserMessage();
        }
        else {
          this.endSpeechRecognition();
        }
      },
      onMouseDown() {
        if (!this.showSend) {
          this.startSpeechRecognition();
        }
      },
      checkCompatibility() {
        if (!recognition) {
          this.error = 'Speech Recognition is not available on this browser. Please use Chrome or Firefox';
        }
      },
      endSpeechRecognition() {
        console.log('I am stoped');
        recognition.stop(() => {
          console.log('sege');
        });
        this.final_transcript = '';
        this.toggle = false;

      },
      recognitionStartHandler() {
        if (!recognition) {
          this.error = 'Speech Recognition is not available on this browser. Please use Chrome or Firefox';
          return false;
        }
        recognition.lang = this.lang;
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.addEventListener('speechstart', event => {
          this.speaking = true;
        });

        recognition.addEventListener('speechend', event => {
          this.speaking = false;
        });

        recognition.addEventListener('result', event => {
          this.interim_transcript = '';

          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              this.final_transcript += event.results[i][0].transcript;
              this.changeInputText(this.final_transcript);

            } else {
              this.interim_transcript += event.results[i][0].transcript;
              this.changeInputText(this.interim_transcript);
            }
          }
        });

      },
      startSpeechRecognition() {
        this.toggle = true;
        this.interim_transcript = '';
        this.final_transcript = '';
        recognition.start();

        console.log('I am Started');
      },
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
    },
    computed: {
      ...mapState(['inputType', 'input']),
      showSend: function() {
        if (!this.toggle && this.input && typeof this.input === 'string' && this.input.length > 0)
          return true;
      },

    },
    mounted: function() {
      this.checkCompatibility();
      this.sendUrl = chrome.extension.getURL('assets/send.svg');
      this.micUrl = chrome.extension.getURL('assets/microphone.svg');
      this.recognitionStartHandler();
      // this.clearInput();
    },
  };
</script>

<style scoped>


</style>