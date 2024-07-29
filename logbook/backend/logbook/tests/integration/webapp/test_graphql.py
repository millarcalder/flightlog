def test_graphql(client, access_token_chewie):
    query = """
    {
        gliders {
            manufacturer
            model
        }
    }
    """
    res = client.post(
        "/graphql",
        json={"query": query},
        headers={"Authorization": f"Bearer {access_token_chewie.access_token}"},
    )
    res = client.post(
        "/graphql",
        json={"query": query},
        headers={"Authorization": f"Bearer {access_token_chewie.access_token}"},
    )
    assert res.json() == {
        "data": {"gliders": [{"manufacturer": "GIN", "model": "Bolero 6"}]}
    }
