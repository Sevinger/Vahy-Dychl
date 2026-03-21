import requests
import sys
import io
from datetime import datetime

class VahyDychlAPITester:
    def __init__(self, base_url="https://dychl-commerce-stage.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.admin_token = None

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

    def test_admin_login_correct_password(self):
        """Test admin login with correct password"""
        test_data = {
            "password": "admin123"
        }
        
        success, response = self.run_test(
            "Admin Login - Correct Password",
            "POST",
            "api/admin/login",
            200,
            data=test_data
        )
        
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"✅ Admin token obtained: {self.admin_token[:20]}...")
            return True
        return False

    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        test_data = {
            "password": "wrongpassword"
        }
        
        return self.run_test(
            "Admin Login - Wrong Password",
            "POST",
            "api/admin/login",
            401,
            data=test_data
        )

    def test_upload_product_image(self):
        """Test uploading a product image"""
        if not self.admin_token:
            print("❌ No admin token available for image upload test")
            return False
            
        # Create a simple test image (1x1 pixel PNG)
        test_image_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\nIDATx\x9cc\xf8\x00\x00\x00\x01\x00\x01\x00\x00\x00\x00IEND\xaeB`\x82'
        
        url = f"{self.base_url}/api/admin/products/l1/image"
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        
        files = {'file': ('test.png', test_image_data, 'image/png')}
        
        self.tests_run += 1
        print(f"\n🔍 Testing Upload Product Image...")
        print(f"URL: {url}")
        
        try:
            response = requests.post(url, files=files, headers=headers, timeout=30)
            print(f"Response Status: {response.status_code}")
            
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Image uploaded successfully")
                try:
                    response_data = response.json()
                    print(f"Response: {response_data}")
                    return True
                except:
                    print(f"Response text: {response.text[:200]}")
                    return True
            else:
                self.failed_tests.append({
                    'test': 'Upload Product Image',
                    'expected': 200,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                print(f"❌ FAILED - Expected 200, got {response.status_code}")
                print(f"Response: {response.text[:200]}")
                return False
                
        except Exception as e:
            self.failed_tests.append({
                'test': 'Upload Product Image',
                'error': str(e)
            })
            print(f"❌ FAILED - Error: {str(e)}")
            return False

    def test_get_product_image(self):
        """Test getting a product image"""
        return self.run_test(
            "Get Product Image",
            "GET",
            "api/products/l1/image",
            200
        )

    def test_get_all_product_images(self):
        """Test getting list of all product images"""
        success, response = self.run_test(
            "Get All Product Images",
            "GET",
            "api/products/images/all",
            200
        )
        
        if success and 'product_ids' in response:
            print(f"✅ Found {len(response['product_ids'])} products with images")
            return True
        return success

    def test_delete_product_image(self):
        """Test deleting a product image"""
        if not self.admin_token:
            print("❌ No admin token available for image delete test")
            return False
            
        url = f"{self.base_url}/api/admin/products/l1/image"
        headers = {'Authorization': f'Bearer {self.admin_token}'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing Delete Product Image...")
        print(f"URL: {url}")
        
        try:
            response = requests.delete(url, headers=headers, timeout=10)
            print(f"Response Status: {response.status_code}")
            
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - Image deleted successfully")
                try:
                    response_data = response.json()
                    print(f"Response: {response_data}")
                    return True
                except:
                    print(f"Response text: {response.text[:200]}")
                    return True
            else:
                self.failed_tests.append({
                    'test': 'Delete Product Image',
                    'expected': 200,
                    'actual': response.status_code,
                    'response': response.text[:200]
                })
                print(f"❌ FAILED - Expected 200, got {response.status_code}")
                print(f"Response: {response.text[:200]}")
                return False
                
        except Exception as e:
            self.failed_tests.append({
                'test': 'Delete Product Image',
                'error': str(e)
            })
            print(f"❌ FAILED - Error: {str(e)}")
            return False

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