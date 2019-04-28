const EventEmitter = artifacts.require('EventEmitter');
const IndirectEventEmitter = artifacts.require('IndirectEventEmitter');
const { BN, should } = require('../setup');
const { eventExist } = require('../getEvents');
const { assertFailure, internalFailWithMsg } = require('../failureUtils');

describe('expectEvent', function() {
  //###########MAIN OPENING TAG==============>

  beforeEach(async function() {
    this.constructionValues = {
      uint: 42,
      boolean: true,
      string: 'OpenZeppelin',
    };

    this.emitter = await EventEmitter.new(
      this.constructionValues.uint,
      this.constructionValues.boolean,
      this.constructionValues.string
    );
  });

  describe('eventExist on blockchain', function() {
    //========EVENT EXIST ON BLOCKCHAIN STARTING TAG ========>>>

    context('short uint value', function() {
      //------start tag short uint value----->
      it('accepts emitted events with correct BN', async function() {
        await eventExist(this.emitter, 'ShortUint', {
          value: new BN(this.constructionValues.uint)
        });
      });

      it('throws if correct Javascript number is passed', async function() {
        await internalFailWithMsg(
          eventExist(this.emitter, 'ShortUint', {
            value: this.constructionValues.uint
          }));
        //------end tag short uint value----->
      });

      it('throws if an incorrect value is passed', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'ShortUint', {
          value: new BN(23)
        }));
      });
    });

    context('boolean value', function() {
      //------start tag boolean value----->
      it('accepts emitted events with correct value', async function() {
        await eventExist(this.emitter, 'Boolean', {
          value: this.constructionValues.boolean
        });
      });

      it('throws if an incorrect value is passed', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'Boolean', {
          value: !this.constructionValues.boolean
        }));
      });

      it(`throws an error if the test expected to fail didn't failed`, async function() {
        await assertFailure(
          internalFailWithMsg(
            eventExist(this.emitter, 'Boolean', {
              value: this.constructionValues.boolean
            })
          )
        );
      });
      //------end tag boolean value----->
    });

    context('string value', function() {
      //------start tag string value---->
      it('accepts emitted events with correct string', async function() {
        await eventExist(this.emitter, 'String');
      });

      it('throws if an incorrect string is passed', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'String', {
          value: 'ClosedZeppelin'
        }));
      });

      it('throws if an unemitted event is requested', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'Unemitted Event'));
      });
      //------start tag string value----->
    });
    //========EVENT EXIST ON BLOCKCHAIN CLOSING TAG ========>>>
  });

  describe('event Argumentless', function() {
    //------start tag event argumentless----->
    describe('with no arguments', function() {
      beforeEach(async function() {
        await this.emitter.emitArgumentless();
      });

      it('accepts emitted events', async function() {
        await eventExist(this.emitter, 'Argumentless');
      });

      it('throws if an unemitted event is requested', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent'));
      });

      it(`throws an error if the test expected to fail didn't failed`, async function() {
        await assertFailure(
          internalFailWithMsg(
            eventExist(this.emitter, 'Argumentless')
            )
          );
      });
    });
    //------end tag event argumentless----->
  });

  describe('with single argument', function() {
    //========WITH SINGLE ARGUMENT OPENING TAG=========>>

    context('short uint value', function() {
      //------start tag short uint value----->
      beforeEach(async function() {
        this.value = 42;
        await this.emitter.emitShortUint(this.value);
      });

      it('accepts emitted events with correct BN', async function() {
        await eventExist(this.emitter, 'ShortUint', {
          value: new BN(this.value)
        });
      });

      it('throws if a correct value is passed but of type number', async function() {
        const errorMsg = 'BigNumber type is expected instead number type received';
        await internalFailWithMsg(
          eventExist(this.emitter, 'ShortUint', {
            value: this.value
          }), errorMsg);
      });

      it('throws if an emitted event with correct BN and incorrect name is requested', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'ShortUint', {
          number: new BN(this.value)
        }));
      });

      it('throws if an unemitted event is requested', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent', {
          value: this.value
        }));

        it(`throws an error if the test expected to failed didn't failed`, async function() {
          await assertFailure(
            internalFailWithMsg(
              eventExist(this.emitter, 'ShortUint')
              )
            );
        });
      });

      it('throws if a correct JavaScript number is passed', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'ShortUint', {
          value: 23
        }));
      });
      //------start tag end uint value----->
    });

    context('short int value', function() {
      //------start tag short int value----->
      beforeEach(async function() {
        this.value = -42;
        await this.emitter.emitShortInt(this.value);
      });

      it('accepts emitted events with correct BN', async function() {
        await eventExist(this.emitter, 'ShortInt', {
          value: new BN(this.value)
        });
      });

      it('throws if a correct value is passed but of type number', async function() {
        const errorMsg = 'BigNumber type is expected instead number type received';
        await internalFailWithMsg(
          eventExist(this.emitter, 'ShortInt', {
            value: this.value
          }), errorMsg);
      });

      it('throws if an unemitted event is requested', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent', {
          value: new BN(this.value)
        }));
      });

      it('throws if an incorrect value is passed', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'ShortInt', {
          value: new BN(-23)
        }));
      });
      //-------end tag short int value----->
    });

    context('long int value', function() {
      //------start tag long int value----->
      beforeEach(async function() {
        this.bigNumValue = new BN('-123456789012345678901234567890');
        await this.emitter.emitLongInt(this.bigNumValue);
      });

      it('accepts emitted events with correct BN', async function() {
        await eventExist(this.emitter, 'LongInt', {
          value: this.bigNumValue
        });
      });

      it('throws if a correct value is passed but of type number', async function() {
        const errorMsg = 'BigNumber type is expected instead number type received';
        await internalFailWithMsg(
          eventExist(this.emitter, 'LongInt', {
            value: -123456789012345678901234567890
          }), errorMsg);
      });

      it('throws if an unemitted event is requested', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent', {
          value: this.bigNumValue
        }));
      });

      it('throws if an incorrect value is passed', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'LongInt', {
          value: new BN(-2300)
        }));
      });
      //------end tag long int value----->
    });

    context('long uint value', function() {
      //------start tag long uint value----->
      beforeEach(async function() {
        this.bigNumValue = new BN('123456789012345678901234567890');
        await this.emitter.emitLongUint(this.bigNumValue);
      });

      it('accepts emitted events with correct BN', async function() {
        await eventExist(this.emitter, 'LongUint', {
          value: this.bigNumValue
        });
      });

      it('throws if a correct value is passed but of type number', async function() {
        const errorMsg = 'BigNumber type is expected instead number type received';
        await internalFailWithMsg(
          eventExist(this.emitter, 'LongUint', {
            value: 123456789012345678901234567890
          }), errorMsg);
      });

      it('throws if an unemitted event is requested', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent', {
          value: this.bigNumValue
        }));
        //------end tag long uint value----->
      });

      it('throws if an incorrect value is passed', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'LongUint', {
          value: new BN('999999999999999999999999')
        }));
      });
    });

    context('address value', function() {
      //------start tag address value----->
      beforeEach(async function() {
        this.value = '0x811412068E9Fbf25dc300a29E5E316f7122b282c';
        await this.emitter.emitAddress(this.value);
      });

      it('accepts emitted events with correct address', async function() {
        await eventExist(this.emitter, 'Address', {
          value: this.value
        });
      });

      it('throws if an unemitted event is requested', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent', {
          value: this.value
        }));
      });

      it('throws if an incorrect value is passed', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent', {
          value: '0x21d04e022e0b52b5d5bcf90b7f1aabf406be002d'
        }));
      });
      //------end tag address value----->
    });

    context('bytes value', function() {
      //------start tag bytes value----->
      context('with non-null value', function() {
        beforeEach(async function() {
          this.value = '0x12345678';
          await this.emitter.emitBytes(this.value);
        });

        it('accepts emitted events with correct bytes', async function() {
          await eventExist(this.emitter, 'Bytes', {
            value: this.value
          });
          // expectEvent.inLogs(this.logs, 'Bytes', { value: this.value });
        });

        it('throws if an unemitted event is requested', async function() {
          await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent', {
            value: this.value
          }));
        });

        it('throws if an incorrect value is passed', async function() {
          await internalFailWithMsg(eventExist(this.emitter, 'Bytes', {
            value: '0x123456'
          }));
        });
      });
      //------start tag bytes value----->
    });

    context('with null value', function() {
      //------start tag with null value----->
      beforeEach(async function() {
        this.value = '0x';
        await this.emitter.emitBytes(this.value);
      });

      it('accepts emitted events with correct bytes', async function() {
        // expectEvent.inLogs(this.logs, 'Bytes', { value: null });
        await eventExist(this.emitter, 'Bytes', {
          value: null
        });
      });

      it('throws if an unemitted event is requested', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent', {
          value: null
        }));
      });

      it('throws if an incorrect value is passed', async function() {
        await internalFailWithMsg(eventExist(this.emitter, 'Bytes', {
          value: '0x123456'
        }));
      });
      //-----end tag with null value----->
    });
    //==============WITH SINGLE ARGUMENT CLOSING TAG========>
  });

  describe('with multiple arguments', function() {
    //-----start tag with multiple arguments----->
    beforeEach(async function() {
      this.uintValue = new BN('123456789012345678901234567890');
      this.booleanValue = true;
      this.stringValue = 'OpenZeppelin';
      await this.emitter.emitLongUintBooleanString(this.uintValue, this.booleanValue, this.stringValue);

    });

    it('accepts correct values', async function() {
      await eventExist(this.emitter, 'LongUintBooleanString', {
        uintValue: this.uintValue,
        booleanValue: this.booleanValue,
        stringValue: this.stringValue,
      });
    });

    it('throws with correct values assigned to wrong arguments', async function() {
      await internalFailWithMsg(eventExist(this.emitter, 'LongUintBooleanString', {
        uintValue: this.booleanValue,
        booleanValue: this.uintValue,
        stringValue: this.stringValue,
      }));
    });

    it('throws when any of the values is incorrect', async function() {
      await internalFailWithMsg(eventExist(this.emitter, 'LongUintBooleanString', {
        uintValue: new BN(23),
        booleanValue: this.booleanValue,
        stringValue: this.stringValue,
      }));

      await internalFailWithMsg(eventExist(this.emitter, 'LongUintBooleanString', {
        uintValue: this.uintValue,
        booleanValue: false,
        stringValue: this.stringValue,
      }));

      await internalFailWithMsg(eventExist(this.emitter, 'LongUintBooleanString', {
        uintValue: this.uintValue,
        booleanValue: this.booleanValue,
        stringValue: 'ClosedZeppelin',
      }));
    });
    //-----end tag with multiple arguments----->
  });

  describe('with multiple events', function() {
    //-----start tag with multiple events----->
    beforeEach(async function() {
      this.uintValue = 42;
      this.booleanValue = true;
      await this.emitter.emitLongUintAndBoolean(this.uintValue, this.booleanValue);
    });

    it('accepts all emitted events with correct values', async function() {
      await eventExist(this.emitter, 'LongUint', {
        value: new BN(this.uintValue)
      });
      await eventExist(this.emitter, 'Boolean', {
        value: this.booleanValue
      });
    });

    it('throws if an unemitted event is requested', async function() {
      await internalFailWithMsg(eventExist(this.emitter, 'UnemittedEvent', {
        value: this.booleanValue
      }));
    });

    it('throws if incorrect values are passed', async function() {
      await internalFailWithMsg(eventExist(this.emitter, 'LongUint', {
        value: new BN(23)
      }));

      await internalFailWithMsg(eventExist(this.emitter, 'Boolean', {
        value: false
      }));
    });
    //-----end tag with multiple events----->
  });

  describe('with events emitted by an indirectly called contract', function() {
    //-----start tag indirectly called contrac---->
    beforeEach(async function() {
      this.secondEmitter = await IndirectEventEmitter.new();
      this.value = 'OpenZeppelin';
      await this.emitter.emitStringAndEmitIndirectly(this.value, this.secondEmitter.address);
    });

    it('accepts events emitted by the directly called contract', async function() {
      await eventExist(this.emitter, 'String', {
        value: this.value
      });
    });

    it('throws when passing events emitted by the indirectly called contract', async function() {
      await internalFailWithMsg(eventExist(this.emitter, 'IndirectString', {
        value: this.value
      }));
    });
    //-----end tag indirectly called contract---->
  });

  describe('IndirectEventEmitter', function() {
    //-----start tag IndirectEventEmitter---->
    describe('when emitting from called contract and indirect calls', function() {
      context('string value', function() {
        beforeEach(async function() {
          this.secondEmitter = await IndirectEventEmitter.new();
          this.value = 'OpenZeppelin';
          await this.emitter.emitStringAndEmitIndirectly(this.value, this.secondEmitter.address);
        });

        context('with directly called contract', function() {
          //-----start tag directly called contract---->
          it('accepts emitted events with correct string', async function() {
            await eventExist(this.emitter, 'String', {
              value: this.value
            });
          });

          it('throws if an incorrect string is passed', async function() {
            await internalFailWithMsg(eventExist(this.emitter, 'String', {
              value: 'ClosedZeppelin'
            }));
          });

          it('throws if an event emitted from other contract is passed', async function() {
            await internalFailWithMsg(eventExist(this.emitter, 'IndirectString', {
              value: this.value
            }));
          });

          it('throws if an incorrect emitter is passed', async function() {
            await internalFailWithMsg(eventExist(this.secondEmitter, 'String', {
              value: this.value
            }));
          });
          //-----end tag directly called contract---->
        });

        context('with indirectly called contract', function() {
          //-----start tag indirectly called contract---->
          it('accepts events emitted from other contracts', async function() {
            await eventExist(this.secondEmitter, 'IndirectString', {
              value: this.value
            });
          });

          it('throws if an unemitted event is requested', async function() {
            await internalFailWithMsg(eventExist(this.secondEmitter, 'UnemittedEvent', {
              value: this.value
            }));
          });

          it('throws if an incorrect string is passed', async function() {
            await internalFailWithMsg(eventExist(this.secondEmitter, 'IndirectString', {
              value: 'ClosedZeppelin'
            }));
          });

          it('throws if an event emitted from other contract is passed', async function() {
            await internalFailWithMsg(eventExist(this.secondEmitter, 'String', {
              value: 'ClosedZeppelin'
            }));
          });

          it('throws if an incorrect emitter is passed', async function() {
            await internalFailWithMsg(eventExist(this.emitter, 'IndirectString', {
              value: 'ClosedZeppelin'
            }));
          });
          //-----start tag indirectly called contract---->
        });
      });
    });

    //-----end tag IndirectEventEmitter---->
  });
  //#############MAIN CLOSING TAG================>
});
