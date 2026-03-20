import requests
import sys
from datetime import datetime

class VahyDychlAPITester:
    def __init__(self, base_url="https://vyvahy-redesign.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"Response Status: {response.status_code}")
            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"Response: {response_data}")
                    return True, response_data
                except:
                    print(f"Response text: {response.text[:200]}")
                    return True, {}
            else:
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                print(f"❌ FAILED - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            self.failed_tests.append({
                'test': name,
                'error': str(e)
            })
            print(f"❌ FAILED - Error: {str(e)}")
            return False, {}

    def test_root_api(self):
        """Test API root endpoint"""
        return self.run_test(
            "API Root",
            "GET",
            "api/",
            200
        )

    def test_contact_submission(self):
        """Test contact form submission"""
        test_data = {
            "name": "Jan Testovací",
            "email": "test@example.com",
            "phone": "+420 123 456 789",
            "company": "Test s.r.o.",
            "message": "Toto je testovací zpráva z automatického testu."
        }
        
        return self.run_test(
            "Contact Form Submission",
            "POST",
            "api/contact",
            200,
            data=test_data
        )

    def test_contact_submission_missing_fields(self):
        """Test contact form with missing required fields"""
        test_data = {
            "email": "test@example.com"
            # Missing name and message
        }
        
        return self.run_test(
            "Contact Form - Missing Required Fields",
            "POST",
            "api/contact",
            422,  # Validation error
            data=test_data
        )

    def test_get_contacts(self):
        """Test getting contacts (if endpoint exists)"""
        return self.run_test(
            "Get Contacts",
            "GET",
            "api/contacts",
            200
        )

    def test_invalid_endpoint(self):
        """Test invalid endpoint"""
        return self.run_test(
            "Invalid Endpoint",
            "GET",
            "api/nonexistent",
            404
        )

def main():
    print("=" * 60)
    print("🧪 VÁHY DYCHL API Testing")
    print("=" * 60)
    
    tester = VahyDychlAPITester()
    
    # Run all tests
    test_methods = [
        tester.test_root_api,
        tester.test_contact_submission,
        tester.test_contact_submission_missing_fields,
        tester.test_get_contacts,
        tester.test_invalid_endpoint
    ]
    
    for test_method in test_methods:
        try:
            test_method()
        except Exception as e:
            print(f"❌ Test method failed: {str(e)}")
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed / tester.tests_run * 100):.1f}%")
    
    if tester.failed_tests:
        print("\n❌ FAILED TESTS:")
        for failure in tester.failed_tests:
            print(f"  • {failure.get('test', 'Unknown test')}")
            if 'error' in failure:
                print(f"    Error: {failure['error']}")
            else:
                print(f"    Expected: {failure.get('expected')}, Got: {failure.get('actual')}")
                print(f"    Response: {failure.get('response', 'N/A')}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())