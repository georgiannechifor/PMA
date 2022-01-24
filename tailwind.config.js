module.exports = {
  important : true,
  content   : [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],
  theme : {
    extend : {
      colors : {
        primary : {
          green : {
            100 : '#46BD84'
          }
        },
        secondary : {
          blue : {
            100 : '#00BEA0'
          }
        }
      },
      boxShadow : {
        DEFAULT : '0px 1px 5px #0000001A'
      },
      height : {
        '2px'   : '2px',
        '100vh' : '100vh'
      },
      maxHeight : {
        90 : '23rem'
      }
    }
  },
  plugins : []
};
