#if RUN_KIDSSTAR_TESTS
using UnityEngine;
using UnityEditor;
using NUnit.Framework;

namespace KidsStar.Libraries.TEMPLATE {

    public class SampleTests {

        [Test]
        public void test_Constructor() {
            Assert.DoesNotThrow(
                () => {
                    new Sample();
                }
            );
        }

    }

}
#endif
