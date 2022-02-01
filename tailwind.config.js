module.exports = {
  important : true,
  mode      : 'jit',
  purge     : [
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
        '2px'    : '2px',
        '100vh'  : '100vh',
        relative : 'calc(100vh - 6rem)'
      },
      maxHeight : {
        90 : '23rem'
      },
      fontSize : {
        tiny : '10px'
      },
      width : {
        200 : '200%',
        90  : '90vw'
      }
    }
  },
  plugins : []
};
