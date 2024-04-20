from logbook.lib.auth import TokenData


def test_token_data():
    assert TokenData(**{"sub": "abc", "extra": "thing"})
