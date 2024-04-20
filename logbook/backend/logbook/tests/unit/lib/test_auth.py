from faker import Faker
from logbook.lib.auth import _generate_password_hash
from logbook.lib.auth import _verify_password

fake = Faker()


def test_password_hashing__valid():
    for password in [fake.word() for _ in range(10)]:
        hashed_password = _generate_password_hash(password)
        assert _verify_password(password, hashed_password)


def test_password_hashing__invalid():
    for password in [fake.word() for _ in range(10)]:
        hashed_password = _generate_password_hash(password)
        assert not _verify_password('incorrectpassword!', hashed_password)
