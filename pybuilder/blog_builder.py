from pybuilder import templates

def build_html_post_from_md(
        markdown_filepath: str = "blog/posts/file.md", 
        save_dir: str = "blog/",
        update_blog_list: bool = False,
):
    """Build HTML blog post from a Markdown file.
    Args:
        markdown_filepath (str): Path to the Markdown file.
        save_dir (str): Directory to save the generated HTML file.
        update_blog_list (bool): Whether to update the blog list json after building the post. (future use)

    Returns:
        None
    """
    filename = markdown_filepath.split("/")[-1].replace(".md", ".html")
    print(
        f"Building HTML blog post from {markdown_filepath} to {save_dir}{filename}"
    )
    md_content = open(markdown_filepath, "r").read()
    html_content = templates.md_to_html_blog_post_template_v1.format(
        markdown_content=md_content
    )
    with open(f"{save_dir}{filename}", "w") as f:
        f.write(html_content)

    print(f"Saved HTML blog post to {save_dir}{filename}")
    return

def build_cmd():
    import argparse
    parser = argparse.ArgumentParser(
        description="Build HTML blog post from Markdown file."
    )
    parser.add_argument(
        "--md", type=str, default="blog/posts/first-post.md",
        help="Path to the Markdown file."
    )
    parser.add_argument(
        "--out", type=str, default="blog/",
        help="Directory to save the generated HTML file."   
    )
    args = parser.parse_args()
    
    build_html_post_from_md(
        markdown_filepath=args.md,
        save_dir=args.out
    )



def build_html_post_from_hasnode_md_text(
        md_text: str, 
        path_to_save: str,
        update_blog_list: bool = False,
):
    """Build HTML blog post from exported Hasnode Markdown text.
    Args:
        md_text (str): raw unformatted markdown text
        path_to_save (str): Full path to save the generated HTML file.
        update_blog_list (bool): Whether to update the blog list json after building the post. (future use)

    Returns:
        None

    Usage:

    ```
    >>> from blog.posts.hashnode import *
    >>> from pybuilder.blog_builder import *
    >>> from pybuibuild_html_post_from_hasnode_md_text(raw_md_text, 'blog/turn-android-device-into-remote-linux-server-in-30-minutes.html')
    ```
    """
    
    print(
        f"Building HTML blog post from raw markdown text to {path_to_save}"
    )
    
    html_content = templates.md_to_html_blog_post_template_v1.format(
        markdown_content=md_text
    )
    with open(path_to_save, "w") as f:
        f.write(html_content)

    print(f"Saved HTML blog post to {path_to_save}")
    return



if __name__ == "__main__":
    # execute the build command if this script is run directly
    print()
    # build_cmd()